import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
  } from "~/components/lib/drawer";
  import { Button } from "~/components/lib/button";
  import { Eye } from "lucide-react";
  import type { Account } from "~/api/types/account";
  
  interface AccountDetailsDrawerProps {
    account: Account;
  }
  
  export function AccountDetailsDrawer({ account }: AccountDetailsDrawerProps) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{account.name}</DrawerTitle>
            <DrawerDescription>
              Kontodetails und weitere Informationen
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-2">
            <p>
              <span className="font-medium">Kontoname:</span> {account.name}
            </p>
            <p>
              <span className="font-medium">Balance:</span>{" "}
              ${account.currentBalance.toFixed(2)}
            </p>
            {/* Weitere Felder hier */}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Schließen</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  