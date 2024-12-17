import { acceptEventVendorApi, rejectEventVendorApi } from "@/api/event";
import { Button } from "@/components/UI/button";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  formAcceptEventSchema,
  formRejectEventSchema,
} from "@/lib/form-schemas";
import {
  convertDateObjectsToStringArray,
  convertDateObjectsToStrings,
  formatDateArray,
  formatDates,
  formatDatetoString,
  formatISODate,
} from "@/lib/format-date";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { getAllVendorsApi } from "@/api/user";
import SpinnerWithText from "@/components/UI/spinner-text";

interface ModalType {
  event: EventType | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleUpdateEvent: (event: EventType) => void;
}

interface EventForm {
  event_name: string;
  status: string;
  location: string;
  proposed_dates: string[];
  vendor_name: string;
  confirmed_date: string;
  created_at: string;
}

const DetailModal = ({
  event,
  open,
  setOpen,
  handleUpdateEvent,
}: ModalType) => {
  const { toast } = useToast();
  const [dates, setDates] = useState("");
  const [dateChoice, setDateChoice] = useState<string[]>([]);
  const [datesValue, setDatesValue] = useState<DateObject[]>([]);
  const [isLoading1, setLoading1] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<{
    [key: string]: string | undefined;
  }>({});
  const originalDefaults = useRef({
    event_name: event?.event_name,
    status: event?.status,
    location: event?.location,
    proposed_dates: event?.proposed_dates,
    vendor_name: event?.vendor_name,
    confirmed_date: event?.confirmed_date,
    remark: event?.remark,
    created_at: event?.created_at,
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isDirty },
    control,
  } = useForm({
    defaultValues: originalDefaults.current,
  });

  useEffect(() => {
    if (event) {
      console.log("confirmed date type", event.confirmed_date);
      const updatedDefaults = {
        event_name: event.event_name,
        status: event.status,
        location: event.location,
        proposed_dates: event.proposed_dates,
        vendor_name: event.vendor_name,
        confirmed_date:
          event.confirmed_date === null
            ? formatISODate(event.confirmed_date)
            : formatDatetoString(event.confirmed_date),
        remark: event.remark,
        created_at: formatISODate(event.created_at),
      };
      setDateChoice(event.proposed_dates);
      originalDefaults.current = updatedDefaults;
      reset(updatedDefaults);

      if (datesValue.length > 0) {
        const newDates = convertDateObjectsToStrings(datesValue);
        const stringDates = formatDateArray(newDates);
        const setDateBody = convertDateObjectsToStringArray(datesValue);
        setDates(stringDates);
        setValue("proposed_dates", setDateBody, { shouldDirty: true });
      } else {
        const value = getValues("proposed_dates");
        setDates(formatDates(value!));
      }
    }
  }, [event, datesValue, reset, getValues]);

  useEffect(() => {
    if (open) {
      setDatesValue([]);
      setErrorMsg({});
    }
  }, [open]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValue(name as keyof EventForm, value);
    setErrorMsg((prevErrors: any) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleInputChange2 = (
    name: keyof EventForm,
    value: string | string[],
  ) => {
    setValue(name, value);
    setErrorMsg((prevErrors: any) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleValidation1 = async (formData: any) => {
    const validationResult = formRejectEventSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrorMsg(newErrors);
      return false;
    }
    return true;
  };

  const handleValidation2 = async (formData: any) => {
    const validationResult = formAcceptEventSchema.safeParse(formData);
    if (formData.confirmed_date === "Not confirmed yet") {
      setErrorMsg({
        ["confirmed_date"]: "Confirm date is required.",
      });
      return false;
    }
    if (!validationResult.success) {
      const newErrors: { [key: string]: string } = {};
      validationResult.error?.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrorMsg(newErrors);
      return false;
    } else return true;
  };

  const onReject = async () => {
    const formValues = {
      remark: getValues("remark"),
    };
    const isValid = await handleValidation1(formValues);
    if (isValid) {
      setLoading1(true);
      const token = sessionStorage.getItem("authToken");
      const parsedToken = JSON.parse(token!) as Token;
      try {
        const response = await rejectEventVendorApi(
          parsedToken.value,
          event?.id,
          formValues,
        );
        if (response.success) {
          toast({
            title: "Rejected !",
          });
          handleUpdateEvent(response.data);
          setLoading1(false);
          setOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Rejection Failed!",
            description: response.response.data.message,
          });
          setLoading1(false);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Reject event Failed!",
          description: "Server connection error",
        });
        setLoading1(false);
      }
    }
  };

  const onAccept = async () => {
    const formValues = {
      confirmed_date: getValues("confirmed_date"),
    };
    console.log(" formValues", formValues);
    const isValid = await handleValidation2(formValues);
    if (isValid) {
      setLoading2(true);
      const token = sessionStorage.getItem("authToken");
      const parsedToken = JSON.parse(token!) as Token;
      try {
        const response = await acceptEventVendorApi(
          parsedToken.value,
          event?.id,
          formValues,
        );
        if (response.success) {
          toast({
            title: "Accepted !",
          });
          handleUpdateEvent(response.data);
          setLoading2(false);
          setOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Accept event Failed!",
            description: response.response.data.message,
          });
          setLoading2(false);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Accept event Failed!",
          description: "Server connection error",
        });
        setLoading2(false);
      }
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        {isFetching ? (
          <div>
            <SpinnerWithText text="Loading..." />
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle className="mb-4">Detail booking event</DialogTitle>
            <div>
              {event?.status !== "pending" && (
                <p className="text-sm italic">
                  {"(Only 'pending' booking event can be reject / accept)"}
                </p>
              )}
              <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const submitEvent = event.nativeEvent as SubmitEvent;
                  const button = submitEvent.submitter as HTMLButtonElement;
                  console.log(" button", button.name);
                  if (button.name === "reject") {
                    handleSubmit(onReject)();
                  } else if (button.name === "accept") {
                    handleSubmit(onAccept)();
                  }
                }}
                className="space-y-2"
              >
                <div className="space-y-1">
                  <label htmlFor="event_name" className="font-semibold">
                    Event name
                  </label>
                  <div className="relative">
                    <input
                      id="event_name"
                      type="text"
                      {...register("event_name", {
                        onChange: (event) => {
                          handleInputChange(event);
                        },
                      })}
                      readOnly
                      disabled
                      className="form-input ps-5 font-normal"
                    />
                  </div>
                  {errorMsg.event_name && (
                    <p className="text-red-500">{errorMsg.event_name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="status" className="font-semibold">
                    Status
                  </label>
                  <div className="relative">
                    <input
                      id="status"
                      type="text"
                      {...register("status")}
                      readOnly
                      disabled
                      className="form-input ps-5 font-normal"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="location" className="font-semibold">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      {...register("location", {
                        onChange: (event) => {
                          handleInputChange(event);
                        },
                      })}
                      readOnly
                      disabled
                      className="form-input ps-5 font-normal"
                    />
                  </div>
                  {errorMsg.location && (
                    <p className="text-red-500">{errorMsg.location}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="proposed_dates" className="font-semibold">
                    Proposed dates
                  </label>
                  <div className="flex w-full gap-2">
                    <input
                      type="text"
                      {...register("proposed_dates")}
                      className="form-input hidden ps-5 font-normal"
                      readOnly
                    />
                    <input
                      id="proposed_dates"
                      type="text"
                      value={dates}
                      className="form-input ps-5 font-normal"
                      readOnly
                      disabled
                    />
                    <div
                      className={`${event?.status !== "pending" ? "cursor-not-allowed" : ""}`}
                    >
                      {/* <DatePicker
                        value={datesValue}
                        onChange={setDatesValue}
                        format="DD-MM-YYYY"
                        multiple
                        render={<Icon />}
                        plugins={[<DatePanel />]}
                        readOnly
                        disabled
                        containerStyle={{
                          width: "40%",
                        }}
                        style={{
                          width: "40%",
                          boxSizing: "border-box",
                          height: "26px",
                        }}
                      /> */}
                    </div>
                  </div>
                  {errorMsg.proposed_dates && (
                    <p className="text-red-500">{errorMsg.proposed_dates}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="vendor_name" className="font-semibold">
                    Vendor name
                  </label>
                  <div className="relative">
                    <input
                      id="vendor_name"
                      type="text"
                      {...register("vendor_name", {
                        onChange: (event) => {
                          handleInputChange(event);
                        },
                      })}
                      readOnly
                      disabled
                      className="form-input ps-5 font-normal"
                    />
                  </div>
                  {errorMsg.vendor_name && (
                    <p className="text-red-500">{errorMsg.vendor_name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="created_at" className="font-semibold">
                    Created date
                  </label>
                  <div className="relative">
                    <input
                      id="created_at"
                      type="text"
                      {...register("created_at", {
                        onChange: (event) => {
                          handleInputChange(event);
                        },
                      })}
                      className="form-input ps-5 font-normal"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor={`confirmed_date`} className="font-semibold">
                    {event?.status === "accepted"
                      ? "Confirmed date"
                      : "Confim date"}
                  </label>
                  <div>
                    <div className="relative text-black">
                      <Controller
                        name="confirmed_date"
                        control={control}
                        render={({ field }) => {
                          const selectedValue = dateChoice?.find(
                            (date) => date === field.value,
                          )
                            ? { value: field.value, label: field.value }
                            : null;

                          return (
                            <Select
                              id="confirmed_date"
                              {...field}
                              isSearchable={false}
                              options={dateChoice?.map((date) => ({
                                value: date,
                                label: date,
                              }))}
                              value={selectedValue}
                              isDisabled={event?.status !== "pending"}
                              styles={{
                                control: (provided: any) => ({
                                  ...provided,
                                  paddingLeft: 6,
                                }),
                              }}
                              onChange={(selectedOption: any) => {
                                const value = selectedOption?.value || "";
                                handleInputChange2("confirmed_date", value);
                                field.onChange(value);
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                  {errorMsg.confirmed_date && (
                    <p className="text-red-500">{errorMsg.confirmed_date}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="remark" className="font-semibold">
                    Remark
                  </label>
                  <div className="relative">
                    <input
                      id="remark"
                      type="text"
                      {...register("remark", {
                        onChange: (event) => {
                          handleInputChange(event);
                        },
                      })}
                      className="form-input ps-5 font-normal"
                      disabled={event?.status !== "pending"}
                      readOnly={event?.status !== "pending"}
                    />
                  </div>
                  {errorMsg.remark && (
                    <p className="text-red-500">{errorMsg.remark}</p>
                  )}
                </div>
                <div className="mt-4 flex w-full items-center justify-between gap-4">
                  <Button
                    className="btn bg-red-400"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    close
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      name="reject"
                      disabled={isLoading1 || event?.status !== "pending"}
                      className="btn"
                      type="submit"
                    >
                      {isLoading1 ? "Rejecting..." : "Reject"}
                    </Button>
                    <Button
                      name="accept"
                      disabled={isLoading2 || event?.status !== "pending"}
                      className="btn"
                      type="submit"
                    >
                      {isLoading2 ? "Accepting..." : "Accept"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
