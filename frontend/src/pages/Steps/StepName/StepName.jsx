import React, { useState } from 'react'
import styles from './StepName.module.css';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import Button from '../../../components/shared/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../../store/activateSlice';

const StepName = ({ onNext }) => {

  const { name } = useSelector((state) => state.activate)

  const dispatch = useDispatch();

  const [fullName, setfullName] = useState(name);

  function nextStep() {

    if (!fullName) {
      return;
    }

    dispatch(setName(fullName));

    onNext();

  }
  return (
    <>
      <Card
        title="What’s your full name?"
        icon="goggle-emoji"
      >
        <TextInput
          value={fullName}
          onChange={(e) => setfullName(e.target.value)}
        />
        <p className={styles.paragraph}>
          People use real names at clubbhhouse :) !
        </p>
        <div>
          <Button onClick={nextStep} text="Next" />
        </div>

      </Card>
    </>

  )
}

export default StepName