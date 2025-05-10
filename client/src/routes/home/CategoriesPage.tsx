import { Trash2 } from "lucide-react";
import { useServices } from "~/api/services/services.provider";
import { Button } from "~/components/lib/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/lib/table";
import { TransactionCreateSheet } from "~/components/ui/categories/CategorySheet";

export default function AccountsPage() {
  const { categories, categoryService, refetchCategories } = useServices();

  const handleDelete = async (id: string) => {
    await categoryService?.deleteCategory(id);
    await refetchCategories();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your categories.</p>
        </div>
        <TransactionCreateSheet />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className="text-center">
                    {cat.description}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
