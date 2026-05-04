import { useNavigate, useRouter } from "@tanstack/react-router";
import { Download, Trash2, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { exportAccountData } from "#/functions/account";
import { authClient } from "#/lib/auth-client";
import { SettingsSection } from "./SettingsSection";

export function AccountSettings() {
  const navigate = useNavigate();
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, startDeleting] = useTransition();
  const [isExporting, startExporting] = useTransition();

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
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-10 rounded-full border-[#cfbda7] bg-white px-4 text-[#2e241d] hover:bg-[#f8f1e7]"
              disabled
            >
              <Upload className="size-4" />
              Import Data
            </Button>
          </div>
        </div>

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
