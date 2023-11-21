import React from 'react';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../style';
import { Arrow, Logo } from 'assets/icons';
import Button from 'components/Button';
import { useNavigation } from '@react-navigation/native';


function Form() {
  const CELL_COUNT = 4;
  const [value, setValue] = React.useState('');
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(59);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const { goBack } = useNavigation()
  const ResendOTP = () => {
    setSeconds(59)
  }
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds])
  return (
    <>
      <TouchableOpacity onPress={() => {
        goBack()
      }} activeOpacity={.9} style={styles.Row}>
        <Arrow />
        <Text style={styles.Title}>OTP</Text>
      </TouchableOpacity>

      <View style={styles.InputsContainer}>
        <Logo style={styles.Logo} />
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={{}}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[
                styles.cellRoot,
                isFocused && styles.focusCell,
              ]}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text disabled={seconds != 0} onPress={() => ResendOTP()} style={styles.ResendText}>Resend the code </Text>
        {seconds != 0 && <Text style={styles.counter}>{minutes}:{seconds}</Text>}
      </View>

      <Button
        fill
        title="Create account"
        style={styles.Button}
        onPress={() => props.handleSubmit()}
      />
    </>
  );
}

export default Form;
