import { postEventsHrApi } from "@/api/event";
import { Button } from "@/components/UI/button";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { useToast } from "@/hooks/use-toast";
import { formUpdateEventSchema } from "@/lib/form-schemas";
import {
  convertDateObjectsToStringArray,
  convertDateObjectsToStrings,
  formatDateArray,
  formatDates,
} from "@/lib/format-date";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { getAllVendorsApi } from "@/api/user";
import SpinnerWithText from "@/components/UI/spinner-text";

interface ModalType {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAddNewEvent: (event: EventType) => void;
}

const AddModal = ({ open, setOpen, handleAddNewEvent }: ModalType) => {
  const { toast } = useToast();
  const [dates, setDates] = useState("");
  const [vendors, setVendors] = useState<VendorType[] | []>([]);
  const [datesValue, setDatesValue] = useState<DateObject[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<{
    [key: string]: string | undefined;
  }>({});

  const originalDefaults = {
    event_name: "",
    location: "",
    proposed_dates: [] as string[],
    vendor_name: "",
  };

  const { register, handleSubmit, setValue, getValues, reset, control } =
    useForm({
      defaultValues: originalDefaults,
    });

  const FetchVendors = useCallback(async () => {
    setFetching(true);
    const authToken = sessionStorage.getItem("authToken");
    const parsedToken = JSON.parse(authToken!) as Token;
    try {
      const response = await getAllVendorsApi(parsedToken.value);
      if (response.success) {
        setVendors(response.data);
        setFetching(false);
      }
    } catch (error) {
      setFetching(false);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (datesValue.length > 0) {
      const newDates = convertDateObjectsToStrings(datesValue);
      const stringDates = formatDateArray(newDates);
      const setDateBody = convertDateObjectsToStringArray(datesValue);
      setDates(stringDates);
      setValue("proposed_dates", setDateBody, { shouldDirty: true });
    } else {
      const value = getValues("proposed_dates");
      setDates(formatDates(value));
    }
  }, [datesValue, reset, getValues]);

  useEffect(() => {
    if (open) {
      setDatesValue([]);
      reset(originalDefaults);
    }
    FetchVendors();
  }, [open, FetchVendors]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValue(name as any, value);
    setErrorMsg((prevErrors: any) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleInputChange2 = (name: any, value: string | string[]) => {
    setValue(name, value);
    setErrorMsg((prevErrors: any) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleValidation = async (formData: any) => {
    const validationResult = formUpdateEventSchema.safeParse(formData);
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

  const onSubmit = async () => {
    const formValues = {
      event_name: getValues("event_name"),
      proposed_dates: getValues("proposed_dates"),
      location: getValues("location"),
      vendor_name: getValues("vendor_name"),
    };
    const isValid = await handleValidation(formValues);
    if (isValid) {
      setLoading(true);
      const token = sessionStorage.getItem("authToken");
      const parsedToken = JSON.parse(token!) as Token;
      try {
        const response = await postEventsHrApi(parsedToken.value, formValues);
        if (response.success) {
          toast({
            title: "Added successfully !",
          });
          handleAddNewEvent(response.data);
          setLoading(false);
          setOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Add New Booking Event Failed!",
            description: response.response.data.message,
          });
          setLoading(false);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Add New Booking Failed!",
          description: "Server connection error",
        });
        setLoading(false);
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
            <DialogTitle>Add new booking event</DialogTitle>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
                      className="form-input ps-5 font-normal"
                    />
                  </div>
                  {errorMsg.event_name && (
                    <p className="text-red-500">{errorMsg.event_name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="status" className="font-semibold">
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
                    />
                    <DatePicker
                      value={datesValue}
                      onChange={setDatesValue}
                      format="DD-MM-YYYY"
                      multiple
                      render={<Icon />}
                      plugins={[<DatePanel />]}
                      containerStyle={{
                        width: "10%",
                      }}
                      style={{
                        width: "10%",
                        boxSizing: "border-box",
                        height: "26px",
                      }}
                    />
                  </div>
                  {errorMsg.proposed_dates && (
                    <p className="text-red-500">{errorMsg.proposed_dates}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`vendor_name`}>Vendor name</label>
                  <div className="relative text-black">
                    <Controller
                      name="vendor_name"
                      control={control}
                      render={({ field }) => {
                        const selectedValue = vendors?.find(
                          (vendor) => vendor.name === field.value,
                        )
                          ? { value: field.value, label: field.value }
                          : null;

                        return (
                          <Select
                            id="vendor_name"
                            {...field}
                            isSearchable={false}
                            options={vendors?.map((vendor) => ({
                              value: vendor.name,
                              label: vendor.name,
                            }))}
                            value={selectedValue}
                            styles={{
                              control: (provided: any) => ({
                                ...provided,
                                paddingLeft: 6,
                              }),
                            }}
                            onChange={(selectedOption: any) => {
                              const value = selectedOption?.value || "";
                              handleInputChange2("vendor_name", value);
                              field.onChange(value);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                  {errorMsg.vendor_name && (
                    <p className="text-red-500">{errorMsg.vendor_name}</p>
                  )}
                </div>
                <div className="mt-4 flex w-full items-center justify-end gap-4">
                  <Button
                    className="btn bg-red-400"
                    type="button"
                    onClick={() => setOpen(false)}
                  >
                    close
                  </Button>
                  <Button disabled={isLoading} className="btn" type="submit">
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;
