// src/pages/students/components/student-feed-table/index.tsx
import DataTable from '@/components/shared/data-table';
import { columns } from '@/pages/students/components/student-feed-table/columns';
import StudentTableActions from '@/pages/students/components/student-feed-table/student-table-action';
import type { TStudentsTableProps } from '@/pages/students/queries/queries';

export default function StudentFeedTable({
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
