import { GrCheckmark, GrEdit, GrFormClose } from 'react-icons/gr';
import { Icon } from '@rsuite/icons';
import { useCallback, useState } from 'react';
import { Input, InputGroup } from 'rsuite';
import { showMessage } from '../misc/helpers';

const EditableInput = ({
  initialValue,
  onSave,
  label = null,
  placeholder = 'Write your nick',
  emptyMsg = 'Input is empty',
  ...inputProps
}) => {
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
      showMessage('info', emptyMsg);
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
