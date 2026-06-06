import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

type Ctx = { open: () => void; close: () => void };
const LoginGateCtx = createContext<Ctx | null>(null);

export function LoginGateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <LoginGateCtx.Provider value={{ open, close }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="size-6" />
            </div>
            <DialogTitle className="text-center text-xl">
              Cadastro necessário
            </DialogTitle>
            <DialogDescription className="text-center">
              Para visualizar valores e realizar compras é necessário realizar
              seu cadastro.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" className="flex-1" onClick={close}>
              Entrar
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={close}>
              Criar Conta
            </Button>
          </DialogFooter>
          <p className="text-center text-xs text-muted-foreground">
            Em breve: cadastro PF e PJ, pedidos via WhatsApp e painel do cliente.
          </p>
        </DialogContent>
      </Dialog>
    </LoginGateCtx.Provider>
  );
}

export function useLoginGate() {
  const ctx = useContext(LoginGateCtx);
  if (!ctx) throw new Error("useLoginGate must be used within LoginGateProvider");
  return ctx;
}
