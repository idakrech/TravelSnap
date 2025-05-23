import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'

type TInputProps = {
  placeholderText?: string
  onInputChange?: (text: string) => void
  secureTextEntry?: boolean
}

const Input: React.FC<TInputProps> = ({placeholderText, onInputChange, secureTextEntry}) => {

  const [inputValue, setInputValue] = useState<string>('')

  const handleOnChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setInputValue(e.nativeEvent.text)
    onInputChange && onInputChange(e.nativeEvent.text)
  }

  return (
    <TextInput 
      style={{backgroundColor: 'white', borderRadius: 8, width: '100%', padding: 8, margin: 8, elevation: 2}}
      placeholder={placeholderText} 
      placeholderTextColor="#7a7a7a"
      value={inputValue} 
      onChange={handleOnChange} 
      secureTextEntry={secureTextEntry}
    />
  )
}

export default Input