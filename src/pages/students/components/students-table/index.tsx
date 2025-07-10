// src/pages/students/components/students-table/index.tsx
import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/students/components/students-table/columns';
import StudentTableActions from '@/pages/students/components/students-table/student-table-action';
import type { TStudentsTableProps } from '@/pages/students/queries/queries';

export default function StudentsTable({
  users,
  pageCount
}: TStudentsTableProps) {
  return (
    <>
      <StudentTableActions />
      {users && (
        <DataTable columns={columns} data={users} pageCount={pageCount} />
      )}
    </>
  );
}
