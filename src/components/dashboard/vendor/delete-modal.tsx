import { deleteEventsHrApi } from "@/api/event";
import { Button } from "@/components/UI/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface ModalType {
  event: EventType | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDeleteEvent: (event: EventType | null) => void;
}

const DeleteModal = ({
  event,
  open,
  setOpen,
  handleDeleteEvent,
}: ModalType) => {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [saveEvent, setSaveEvent] = useState<EventType | null>(null);

  useEffect(() => {
    if (event) {
      setSaveEvent(event);
    }
  }, [event]);

  const onSubmit = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("authToken");
    const parsedToken = JSON.parse(token!) as Token;
    try {
      const response = await deleteEventsHrApi(
        parsedToken.value,
        saveEvent?.id,
      );
      if (response.success) {
        toast({
          title: "Deleted successfully !",
        });
        handleDeleteEvent(event);
        setLoading(false);
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Delete Booking Event Failed!",
          description: response.response.data.message,
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Booking Failed!",
        description: "Server connection error",
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure want delete booking event "{saveEvent?.event_name}"
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-4 flex w-full items-center justify-end gap-4">
            <Button
              className="btn bg-red-400"
              type="button"
              onClick={() => setOpen(false)}
            >
              close
            </Button>
            <Button disabled={isLoading} className="btn" onClick={onSubmit}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
