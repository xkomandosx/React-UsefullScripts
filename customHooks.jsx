import { useEffect, useRef } from "react";

export const useEffectWithoutFirst = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export const useEffectWithoutFirstWithDelay = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      const timeOut = setTimeout(() => func(), 1500);
      return () => clearTimeout(timeOut);
    } else {
      didMount.current = true;
    }
  }, deps);
};

const validate = (validations, values) => {
  const errors = validations
    .map((validation) => validation(values))
    .filter((validation) => typeof validation === "object");
  return {
    isValid: errors.length === 0,
    errors: errors.reduce((errors, error) => ({ ...errors, ...error }), {}),
  };
};

export const useForm = (
  initialState = {},
  validations = [],
  fieldsProps = {}
) => {
  const { isValid: initialIsValid, errors: initialErrors } = validate(
    validations,
    initialState
  );
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [isValid, setValid] = useState(initialIsValid);
  const [touched, setTouched] = useState({});

  const changeHandler = (event) => {
    const currentValue = event.currentTarget.dataset.key
      ? parseInt(event.currentTarget.dataset.key)
      : event.target.type === "checkbox"
      ? event.target.checked
      : inputValidation(event.target.value, fieldsProps[event.target.id]);
    const currentKey =
      event.target.id === "" ? event.target.parentElement.id : event.target.id;
    const newValues = { ...values, [currentKey]: currentValue };
    const { isValid, errors } = validate(validations, newValues);
    setValues(newValues);
    setValid(isValid);
    setErrors(errors);
    setTouched({ ...touched, [currentKey]: true });
  };

  const refreshHandler = () => {
    const { isValid, errors } = validate(validations, values);
    setValid(isValid);
    setErrors(errors);
  };

  return {
    values,
    isValid,
    errors,
    touched,
    changeHandler,
    refreshHandler,
  };
};
