const Resident = require("../models/Resident");
const Staff = require("../models/Staff");
const LeaveRequest = require("../models/LeaveRequest");

const getResidentField = (shift) =>
  shift === "Day" ? "dayCaretaker" : "nightCaretaker";

const getUnavailableCaretakerIds = async (leaveRequest) => {
  const leavingCaretakerId = leaveRequest.caretakerId._id
    ? leaveRequest.caretakerId._id
    : leaveRequest.caretakerId;

  return await LeaveRequest.find({
    status: "Approved",
    fromDate: {
      $lte: leaveRequest.toDate,
    },
    toDate: {
      $gte: leaveRequest.fromDate,
    },
    caretakerId: {
      $ne: leavingCaretakerId,
    },
  }).distinct("caretakerId");
};

const getAvailableCaretakersForLeave = async (leaveRequest) => {
  const leavingCaretakerId = leaveRequest.caretakerId._id
    ? leaveRequest.caretakerId._id
    : leaveRequest.caretakerId;

  const unavailableCaretakerIds = await getUnavailableCaretakerIds(
    leaveRequest,
  );

  const residentField = getResidentField(leaveRequest.caretakerId.shift);

  return await Staff.find({
    role: "Caretaker",
    shift: leaveRequest.caretakerId.shift,
    _id: {
      $nin: [leavingCaretakerId, ...unavailableCaretakerIds],
    },
  }).lean();
};

const assignResidentsForLeave = async (leaveRequest) => {
  const residentField = getResidentField(leaveRequest.caretakerId.shift);

  const residents = await Resident.find({
    [residentField]: leaveRequest.caretakerId._id,
    status: "Active",
  });

  if (residents.length === 0) {
    return [];
  }

  const availableCaretakers = await getAvailableCaretakersForLeave(
    leaveRequest,
  );

  if (availableCaretakers.length === 0) {
    throw new Error(
      `No replacement ${leaveRequest.caretakerId.shift} caretaker available for approved leave`,
    );
  }

  const caretakerLoads = [];

  for (const caretaker of availableCaretakers) {
    const count = await Resident.countDocuments({
      [residentField]: caretaker._id,
      status: "Active",
    });

    caretakerLoads.push({
      caretakerId: caretaker._id,
      count,
    });
  }

  const replacements = [];

  for (const resident of residents) {
    caretakerLoads.sort((a, b) => a.count - b.count);

    const selectedCaretaker = caretakerLoads[0];

    resident[residentField] = selectedCaretaker.caretakerId;
    await resident.save();

    replacements.push({
      residentId: resident._id,
      oldCaretakerId: leaveRequest.caretakerId._id,
      newCaretakerId: selectedCaretaker.caretakerId,
    });

    selectedCaretaker.count += 1;
  }

  leaveRequest.replacementCaretakers = replacements;
  leaveRequest.reassignmentCompleted = true;
  await leaveRequest.save();

  return replacements;
};

const restoreResidentsAfterLeave = async (leaveRequest) => {
  if (!leaveRequest.replacementCaretakers?.length) {
    leaveRequest.restorationCompleted = true;
    await leaveRequest.save();
    return [];
  }

  const residentField = getResidentField(leaveRequest.caretakerId.shift);

  const restorations = [];

  for (const replacement of leaveRequest.replacementCaretakers) {
    const resident = await Resident.findById(replacement.residentId);

    if (!resident) {
      continue;
    }

    if (
      resident[residentField]?.toString() !==
      replacement.newCaretakerId.toString()
    ) {
      continue;
    }

    resident[residentField] = replacement.oldCaretakerId;
    await resident.save();

    restorations.push(replacement.residentId);
  }

  leaveRequest.restorationCompleted = true;
  await leaveRequest.save();

  return restorations;
};

module.exports = {
  getAvailableCaretakersForLeave,
  assignResidentsForLeave,
  restoreResidentsAfterLeave,
};
