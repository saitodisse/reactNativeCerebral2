import React from 'react'
import {
  View
} from 'react-native'
import {connect} from 'cerebral/react'
import styles from './styles'

function getColor (counter) {
  switch (counter % 4) {
    case 0:
      return {backgroundColor: '#F5D9C3'}
    case 1:
      return {backgroundColor: '#D2ACB9'}
    case 2:
      return {backgroundColor: '#B4707F'}
    case 3:
      return {backgroundColor: '#75617C'}
    case 4:
      return {backgroundColor: '#412E34'}
    default:
      return {backgroundColor: 'white'}
  }
}

export default connect((props) => ({
  counter: `blocks.${props.rowId % 6}.${props.colId % 6}.counter`
}), {
  blockPressed: 'blockPressed'
},
  function Block (props) {
    return (
      <View style={styles.buttonContainer}>
        <View style={[styles.button, getColor(props.counter)]} />
      </View>
    )
  }
)