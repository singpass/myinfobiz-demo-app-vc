import Button from "components/common/Button";
import locale from "@/config/locale";

export default (props: Omit<JSX.IntrinsicElements["button"], "ref">) => (
  <Button.Secondary {...props} style={{ width: "120px" }}>
    {locale.button.ok}
  </Button.Secondary>
);
