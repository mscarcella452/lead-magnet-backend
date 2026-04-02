import {
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  CircleUserIcon,
  MailIcon,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/controls/input-group";
import { InputProps } from "@/components/ui/controls/input";
import { useState } from "react";

export const UsernameInput = ({ ...props }: InputProps) => (
  <InputGroup>
    <InputGroupAddon align="inline-start">
      <CircleUserIcon />
    </InputGroupAddon>
    <InputGroupInput
      type="text"
      placeholder="Username"
      maxLength={30}
      {...props}
    />
  </InputGroup>
);

export const EmailInput = ({ ...props }: InputProps) => (
  <InputGroup>
    <InputGroupAddon align="inline-start">
      <MailIcon />
    </InputGroupAddon>
    <InputGroupInput
      type="email"
      placeholder="Email"
      maxLength={254}
      {...props}
    />
  </InputGroup>
);

export const PasswordInput = ({ ...props }: InputProps) => {
  const [viewPassword, setViewPassword] = useState(false);

  const toggleViewPassword = () => setViewPassword((prev) => !prev);

  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <LockKeyholeIcon />
      </InputGroupAddon>
      <InputGroupInput
        type={viewPassword ? "text" : "password"}
        placeholder="Password"
        // bcrypt silently truncates passwords at 72 bytes without warning. If a user sets a 100 character password, bcrypt only hashes the first 72 characters. So maxLength={72} on the input prevents them from thinking they have a longer password than they actually do.
        maxLength={72}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={toggleViewPassword}>
          {viewPassword ? <EyeIcon /> : <EyeOffIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
