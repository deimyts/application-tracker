-- CreateTable
CREATE TABLE "EmploymentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employerName" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    CONSTRAINT "EmploymentRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmploymentRecord_id_key" ON "EmploymentRecord"("id");
