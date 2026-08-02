import React from "react";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ wrapperClassName = "", children, ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        <table ref={ref} {...props}>
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => (
    <thead ref={ref} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ children, ...props }, ref) => (
    <tbody ref={ref} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ children, ...props }, ref) => (
    <tr ref={ref} {...props}>
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ children, ...props }, ref) => (
    <th ref={ref} {...props}>
      {children}
    </th>
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ children, ...props }, ref) => (
    <td ref={ref} {...props}>
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
