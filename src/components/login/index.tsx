import { loginApi } from "@/api/user";
import { useToast } from "@/hooks/use-toast";
import { formLoginSchema } from "@/lib/form-schemas";
import { LogIn, User2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Button } from "../UI/button";
import { useNavigate } from "react-router-dom";
import { store } from "@/store";
import { login } from "@/store/user-slice";
import { useDispatch } from "react-redux";
import { Spinner } from "../UI/spinner";

const LoginComponent = () => {
  const { toast } = useToast();
  const [errorMsg, setErrorMsg] = useState<{
    [key: string]: string | undefined;
  }>({});
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValue(name as "name" | "password", value);
    setErrorMsg((prevErrors: any) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleValidation = async (formData: any) => {
    const validationResult = formLoginSchema.safeParse(formData);

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
      name: getValues("name"),
      password: getValues("password"),
    };
    const isValid = await handleValidation(formValues);
    if (isValid) {
      setLoading(true);
      try {
        const response = await loginApi(formValues);
        const expirationTime = Date.now() + 50 * 60 * 1000;
        if (response.success) {
          store.dispatch(login());
          sessionStorage.setItem(
            "authToken",
            JSON.stringify({
              value: response.token,
              exp: expirationTime,
            }),
          );
          toast({
            title: "Login Success !",
          });
          setTimeout(() => {
            window.location.replace("/");
          }, 2000);
        } else {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Login Failed!",
            description: response.response.data.message,
          });
        }
      } catch (error) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Login Failed!",
          description: "Server connection error",
        });
      }
    }
  };

  return (
    <div className="m-auto w-fit min-w-[320px] space-y-4 rounded-md bg-card p-6 px-8 pb-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-2"
      >
        <p className="text-center text-lg font-extrabold">User Login</p>
        <div className="space-y-1">
          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              {...register("name", {
                onChange: (event) => {
                  handleInputChange(event);
                },
              })}
              placeholder="input hr or vendor name"
              className="form-input ps-10 font-normal"
            />
            <span className="absolute start-2 top-1/2 -translate-y-1/2">
              <User2Icon width={18} className="text-slate-500" />
            </span>
          </div>
          {errorMsg.name && <p className="text-red-500">{errorMsg.name}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              {...register("password", {
                onChange: (event) => {
                  handleInputChange(event);
                },
              })}
              placeholder="input password"
              className="form-input ps-10 font-normal"
            />
            <span className="absolute start-2 top-1/2 -translate-y-1/2">
              <LogIn width={18} className="text-slate-500" />
            </span>
          </div>
          {errorMsg.password && (
            <p className="text-red-500">{errorMsg.password}</p>
          )}
        </div>
        <Button
          disabled={isLoading}
          size="sm"
          className="btn !mt-4 self-end text-right"
        >
          {isLoading ? (
            <>
              <Spinner /> Loading...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginComponent;
function setProfile(arg0: { user: any }): any {
  throw new Error("Function not implemented.");
}
