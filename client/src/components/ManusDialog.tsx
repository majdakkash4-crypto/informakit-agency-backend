import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoginDialogProps {
  title?: string;
  open?: boolean;
  onLogin: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function ManusDialog({
  title,
  open = false,
  onLogin,
  onOpenChange,
}: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] text-center">
        <div className="flex flex-col items-center gap-2 pt-4">
          {title && (
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          )}
          <DialogDescription>
            Bitte melde dich an, um fortzufahren.
          </DialogDescription>
        </div>
        <DialogFooter className="px-5 py-5">
          <Button onClick={onLogin} className="w-full">
            Zum Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
