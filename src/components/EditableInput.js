import { GrCheckmark, GrEdit, GrFormClose } from 'react-icons/gr';
import { Icon } from '@rsuite/icons';
import { useCallback, useState } from 'react';
import { Input, InputGroup, Notification, useToaster } from 'rsuite';

const EditableInput = ({
  initialValue,
  onSave,
  label = null,
  placeholder = 'Write your nick',
  emptyMsg = 'Input is empty',
  ...inputProps
}) => {
  const toaster = useToaster();
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setIsEditable((p) => !p);
    setInput(initialValue);
  }, [initialValue]);

  const onSaveClick = async () => {
    const trimmed = input.trim();

    if (trimmed === '') {
      const messageOnEmpty = <Notification type={'info'} header={emptyMsg} />;

      toaster.push(messageOnEmpty, { placement: 'topCenter' });
    }

    if (trimmed !== initialValue) {
      await onSave(trimmed);
    }
    setIsEditable(false);
  };

  return (
    <div>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          placeholder={placeholder}
          disabled={!isEditable}
          value={input}
          onChange={onInputChange}
        />
        <InputGroup.Button onClick={onEditClick}>
          <Icon as={isEditable ? GrFormClose : GrEdit} />
        </InputGroup.Button>

        {isEditable && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon as={GrCheckmark} />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
