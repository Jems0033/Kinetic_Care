const Resident = require("../models/Resident");
const Staff = require("../models/Staff");
const LeaveRequest = require("../models/LeaveRequest");

const getResidentField = (role,shift)=>{

if(role==="Doctor"){
    return shift==="Day"
    ?"dayDoctor"
    :"nightDoctor";
}

return shift==="Day"
?"dayCaretaker"
:"nightCaretaker";

}

const getUnavailableStaffIds = async (leaveRequest) => {
  const leavingCaretakerId = leaveRequest.staffId._id
    ? leaveRequest.staffId._id
    : leaveRequest.staffId;

  return await LeaveRequest.find({
    status: "Approved",
    fromDate: {
      $lte: leaveRequest.toDate,
    },
    toDate: {
      $gte: leaveRequest.fromDate,
    },
    staffId: {
      $ne: leavingCaretakerId,
    },
  }).distinct("staffId");
};

const getAvailableStaffForLeave = async (leaveRequest) => {
  const leavingCaretakerId = leaveRequest.staffId._id
    ? leaveRequest.staffId._id
    : leaveRequest.staffId;

  const unavailableStaffIds = await getUnavailableStaffIds(
    leaveRequest,
  );

  const residentField = getResidentField(
    leaveRequest.staffRole,
    leaveRequest.staffId.shift
);

  return await Staff.find({
role: leaveRequest.staffRole,
    shift: leaveRequest.staffId.shift,
    _id: {
      $nin: [leavingCaretakerId, ...unavailableStaffIds],
    },
  }).lean();
};

const assignResidentsForLeave = async (leaveRequest) => {
  const residentField = getResidentField(
    leaveRequest.staffRole,
    leaveRequest.staffId.shift
);

  const residents = await Resident.find({
    [residentField]: leaveRequest.staffId._id,
    status: "Active",
  });

  if (residents.length === 0) {
    return [];
  }

  const availableStaff = await getAvailableStaffForLeave(
    leaveRequest,
  );

  if (availableStaff.length === 0) {
    throw new Error(
`No replacement ${leaveRequest.staffId.shift} ${leaveRequest.staffRole} available`
);
  }

  const staffLoads = [];

  for (const caretaker of availableStaff) {
    const count = await Resident.countDocuments({
      [residentField]: caretaker._id,
      status: "Active",
    });

    staffLoads.push({
      staffId: caretaker._id,
      count,
    });
  }

  const replacements = [];

  for (const resident of residents) {
    staffLoads.sort((a, b) => a.count - b.count);

    const selectedCaretaker = staffLoads[0];

    resident[residentField] = selectedCaretaker.staffId;
    await resident.save();

    replacements.push({
      residentId: resident._id,
      oldStaffId: leaveRequest.staffId._id,
      newStaffId: selectedCaretaker.staffId,
    });

    selectedCaretaker.count += 1;
  }

  leaveRequest.replacements = replacements;
  leaveRequest.reassignmentCompleted = true;
  await leaveRequest.save();

  return replacements;
};

const restoreResidentsAfterLeave = async (leaveRequest) => {
  if (!leaveRequest.replacements?.length) {
    leaveRequest.restorationCompleted = true;
    await leaveRequest.save();
    return [];
  }

  const residentField = getResidentField(
    leaveRequest.staffRole,
    leaveRequest.staffId.shift
);

  const restorations = [];

  for (const replacement of leaveRequest.replacements) {
    const resident = await Resident.findById(replacement.residentId);

    if (!resident) {
      continue;
    }

    if (
      resident[residentField]?.toString() !==
      replacement.newStaffId.toString()
    ) {
      continue;
    }

    resident[residentField] = replacement.oldStaffId;
    await resident.save();

    restorations.push(replacement.residentId);
  }

  leaveRequest.restorationCompleted = true;
  await leaveRequest.save();

  return restorations;
};

module.exports = {
  getAvailableStaffForLeave,
  assignResidentsForLeave,
  restoreResidentsAfterLeave,
  getResidentField,
};
