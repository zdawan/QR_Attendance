export function generateDemoSessions() {
  const now = new Date()

  return [
    {
      sessionId: "ABC123XY",
      subjectCode: "IT01",
      createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      expiresAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(), // expires in 30 minutes
      createdBy: "faculty@institution.edu",
    },
    {
      sessionId: "DEF456ZW",
      subjectCode: "CSE02",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      expiresAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // expired 1 hour ago
      createdBy: "faculty@institution.edu",
    },
    {
      sessionId: "GHI789QR",
      subjectCode: "ECE03",
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      expiresAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(), // expired 23 hours ago
      createdBy: "faculty@institution.edu",
    },
  ]
}

export function generateDemoStudents() {
  return [
    {
      name: "Ashwin",
      regNo: "71812205101",
      departmentId: "IT01",
    },
    {
      name: "Deepankumar",
      regNo: "71812205102",
      departmentId: "IT01",
    },
    {
      name: "Dharshankumar",
      regNo: "71812205103",
      departmentId: "CSE02",
    },
    {
      name: "Kavinraj",
      regNo: "71812205104",
      departmentId: "CSE02",
    },
    {
      name: "Prithiviraj",
      regNo: "71812205105",
      departmentId: "ECE03",
    },
    {
      name: "Haridass",
      regNo: "71812205106",
      departmentId: "MECH04",
    },
  ]
}
