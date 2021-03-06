import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import {set, state, input} from 'cerebral/operators'

const createAllBlocks = ({state}) => {
  const rows = state.get('gridSize')
  const cols = state.get('gridSize')
  const blockRowsAndCols = new Array(rows).fill().reduce((rowsObj, _, i) => {
    rowsObj[i] = new Array(cols).fill().reduce((colsObj, _, j) => {
      colsObj[j] = {counter: 0}
      return colsObj
    }, {})
    return rowsObj
  }, {})
  return {blockRowsAndCols}
}

const controller = Controller({
  options: {strictRender: true},
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools({
    // If running standalone debugger
    remoteDebugger: '192.168.0.5:8585',
    // Time travel
    storeMutations: false,
    // Warnings on mutating outside "state" API
    preventExternalMutations: true,
    // Warnings when strict render path usage is wrong
    verifyStrictRender: true,
    // Throw error when overwriting existing input property
    preventInputPropReplacement: false,
    // Shows a warning when you have components with number of state dependencies
    // or signals above the set number
    bigComponentsWarning: {state: 10, signals: 10},
    // Will reset debugger to currently focused application
    multipleApps: true,
    // In addition to basic JavaScript types Object, Array, String, Number
    // and Boolean, File, FileList and Blob is allowed to be stored in state
    // tree. You can add additional types if you know what you are doing :)
    allowedTypes: []
  }),

  state: {
    loaded: null,
    blocks: null,
    gridSize: 4,
    colorsList: {
      0: ['#F5D9C3', '#D2ACB9', '#B4707F', '#75617C', '#412E34'],
      1: ['#00D9C3', '#00ACB9', '#00707F', '#00617C', '#002E34']
    },
    colorsListIndex: 0
  },

  signals: {
    bootstrap: [
      createAllBlocks,
      set(state`blocks`, input`blockRowsAndCols`),
      set(state`loaded`, true)
    ],
    blockPressed: [
      ({state, input}) => {
        let counterPath = `blocks.${input.rowId}.${input.colId}.counter`
        state.set(counterPath, state.get(counterPath) + 1)
      }
    ],
    leftButtonPressed: [
      ({state}) => {
        const blocks = state.get('blocks')
        const keysRows = Object.keys(blocks)
        const newBlocks = keysRows.reduce((prev, _, indexRow) => {
          const blockRow = blocks[indexRow]
          const keysColumns = Object.keys(blockRow)
          prev[indexRow] = keysColumns.reduce((prev2, _, indexCol) => {
            let newIndex = indexCol + 1
            if (newIndex >= keysColumns.length) {
              newIndex = 0
            }
            prev2[indexCol] = blockRow[newIndex]
            return prev2
          }, {})
          return prev
        }, {})
        state.set('blocks', newBlocks)
      }
    ],
    rightButtonPressed: [
      ({state}) => {
        const blocks = state.get('blocks')
        const keysRows = Object.keys(blocks)
        const newBlocks = keysRows.reduce((prev, _, indexRow) => {
          const blockRow = blocks[indexRow]
          const keysColumns = Object.keys(blockRow)
          prev[indexRow] = keysColumns.reduce((prev2, _, indexCol) => {
            let newIndex = indexCol - 1
            if (newIndex < 0) {
              newIndex = keysColumns.length - 1
            }
            prev2[indexCol] = blockRow[newIndex]
            return prev2
          }, {})
          return prev
        }, {})
        state.set('blocks', newBlocks)
      }
    ],
    upButtonPressed: [
      ({state}) => {
        const blocks = state.get('blocks')
        const keysRows = Object.keys(blocks)
        const newBlocks = keysRows.reduce((prev, _, indexRow) => {
          let newRowIndex = indexRow + 1
          if (newRowIndex > keysRows.length - 1) {
            newRowIndex = 0
          }
          prev[indexRow] = blocks[newRowIndex]
          return prev
        }, {})
        state.set('blocks', newBlocks)
      }
    ],
    downButtonPressed: [
      ({state}) => {
        const blocks = state.get('blocks')
        const keysRows = Object.keys(blocks)
        const newBlocks = keysRows.reduce((prev, _, indexRow) => {
          let newRowIndex = indexRow - 1
          if (newRowIndex < 0) {
            newRowIndex = keysRows.length - 1
          }
          prev[indexRow] = blocks[newRowIndex]
          return prev
        }, {})
        state.set('blocks', newBlocks)
      }
    ],
    gridSizePressed: [
      set(state`loaded`, false),
      ({state}) => {
        let gridSize = state.get('gridSize')
        gridSize++
        if (gridSize > 8) {
          gridSize = 4
        }
        state.set('gridSize', gridSize)
      },
      createAllBlocks,
      set(state`blocks`, input`blockRowsAndCols`),
      set(state`loaded`, true)
    ],
    changeColorsPressed: [
      ({state}) => {
        const colorsList = state.get('colorsList')
        const colorsListIndex = state.get('colorsListIndex')
        const listLen = Object.keys(colorsList).length
        state.set('colorsListIndex', (colorsListIndex + 1) % listLen)
      }
    ]
  }
})

export default controller

