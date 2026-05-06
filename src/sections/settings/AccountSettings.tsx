import { useNavigate, useRouter } from "@tanstack/react-router";
import { Download, Trash2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { exportAccountData, importAccountData } from "#/functions/account";
import { authClient } from "#/lib/auth-client";
import { SettingsSection } from "./SettingsSection";

export function AccountSettings() {
  const navigate = useNavigate();
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, startDeleting] = useTransition();
  const [isExporting, startExporting] = useTransition();
  const [isImporting, startImporting] = useTransition();
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDeleteConfirm() {
    startDeleting(async () => {
      await authClient.deleteUser();
      await authClient.signOut().catch(() => undefined);
      await router.invalidate();
      await navigate({ to: "/signup" });
    });
  }

  function handleDataExport() {
    startExporting(async () => {
      const data = await exportAccountData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "keinbudget-export.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function handleFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportResult(null);
    setImportError(null);

    startImporting(async () => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const result = await importAccountData({ data: parsed });
        setImportResult(
          `Imported ${result.importedCategories} categories and ${result.importedSubscriptions} subscriptions.`,
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to import data.";
        if (
          message === "Unsupported export version." ||
          message.startsWith("Unsupported export version:")
        ) {
          setImportError(
            "This export file is from a newer version of keinbudget and cannot be imported.",
          );
        } else if (message === "Failed to create category") {
          setImportError(
            "Could not import categories. Please check the file format.",
          );
        } else if (message === "Failed to create subscription") {
          setImportError(
            "Could not import subscriptions. Please check the file format.",
          );
        } else {
          setImportError("Failed to import data.");
        }
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <SettingsSection title="Account Settings">
      <div className="overflow-hidden">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-[#2e241d]">
              Import account data
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[#7a6a5d]">
              Import previously exported data.
            </p>
          </div>

          <div className="shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-10 rounded-full border-[#cfbda7] bg-white px-4 text-[#2e241d] hover:bg-[#f8f1e7]"
              onClick={handleFileSelect}
              disabled={isImporting}
            >
              <Upload className="size-4" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </div>

        {importResult && (
          <div className="px-5 pb-4 sm:px-6">
            <p className="text-sm text-green-700">{importResult}</p>
          </div>
        )}
        {importError && (
          <div className="px-5 pb-4 sm:px-6">
            <p className="text-sm text-red-600">{importError}</p>
          </div>
        )}

        <Separator className="bg-[#efe4d7]" />

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-[#2e241d]">
              Export account data
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[#7a6a5d]">
              Download a copy of your subscriptions and other data.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleDataExport}
              disabled={isExporting}
              className="h-10 rounded-full border-[#cfbda7] bg-white px-4 text-[#2e241d] hover:bg-[#f8f1e7]"
            >
              <Download className="size-4" />
              {isExporting ? "Exporting..." : "Export all data"}
            </Button>
          </div>
        </div>

        <Separator className="bg-[#efe4d7]" />
        {/** delete account */}
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight text-[#2e241d]">
              Delete account
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[#7a6a5d]">
              Permanently remove this account and all associated data. This is
              not reversible.
            </p>
          </div>

          <div className="shrink-0">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="h-10 rounded-full border-[#cfbda7] bg-white px-4 text-[#2e241d] hover:bg-[#f8f1e7]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="h-10 rounded-full px-4"
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? "Deleting..." : "Confirm delete"}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={() => setIsConfirmingDelete(true)}
                className="h-10 rounded-full px-4"
              >
                <Trash2 className="size-4" />
                Delete account
              </Button>
            )}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
