import React, { Component, useCallback, useMemo, useState } from 'react';
import './App.css';

interface Param {
  id: number;
  name: string;
  type: 'string';
}
interface ParamValue {
  paramId: number;
  value: string;
}
interface Model {
  paramValues: ParamValue[];
  colors: any[];
}
interface Props {
  params: Param[];
  model: Model;
  onModelChange: (updatedModel: Model) => void;
}
interface State {
  editedModel: Model;
}


function App() {
  const [model, setModel] = useState<Model>({
    paramValues: [],
    colors: []
  })

  const [params, setParams] = useState<Param[]>([])

  const [inputValue, setInputValue] = useState('')

  const onInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const isAddButtonDisabled = useMemo(() => {
    return inputValue === '' || params.some(p => p.name === inputValue)
  }, [inputValue, params])

  const onButtonClick = useCallback(() => {
    if (isAddButtonDisabled) {
      return alert('Not uniq name or empty string')
    }

    const newId = (() => {
      if (params.length === 0) {
        return 0
      }
      return params.reduce((p, c) => p.id > c.id ? p : c).id + 1
    })()

    setParams(prev => [...prev, { id: newId, name: inputValue, type: 'string' }])

    setModel(prev => ({
      colors: prev.colors,
      paramValues: [...prev.paramValues, { paramId: newId, value: '' }]
    }))
  }, [isAddButtonDisabled, inputValue, params])

  return <>
    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '20px', alignItems: 'center' }}>
      <label htmlFor="paramName">New param name</label>
      <input name="paramName" value={inputValue} onChange={onInputChange} />
      <button onClick={onButtonClick}      >
        Add Param
      </button>
    </div>
    <hr />
    <ParamEditor params={params} model={model} onModelChange={setModel} />
  </>
}

export default App

class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editedModel: { ...props.model },
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ) {
    if (this.props.model.paramValues.length > prevProps.model.paramValues.length) {
      const newParamValue = this.props.model.paramValues[this.props.model.paramValues.length - 1]
      this.setState({
        editedModel: {
          paramValues: [...prevState.editedModel.paramValues, newParamValue],
          colors: prevState.editedModel.colors
        }
      });
    }
  }

  handleParamChange = (paramId: number, value: string) => {
    const { editedModel } = this.state;
    const updatedParamValues = editedModel.paramValues.map((paramValue) => {
      if (paramValue.paramId === paramId) {
        return { ...paramValue, value };
      }
      return paramValue;
    });
    const updatedModel: Model = {
      ...editedModel,
      paramValues: updatedParamValues,
    };
    this.setState({ editedModel: updatedModel });
    console.debug(updatedModel)
    this.props.onModelChange(updatedModel);
  };

  getModel = () => {
    return this.state.editedModel;
  };

  render() {
    const { params } = this.props;
    const { editedModel } = this.state;

    return (
      <div>
        {params.map((param) => (
          <div key={param.id} style={{ display: 'flex', flexDirection: 'row', columnGap: '20px', alignItems: 'center' }}>
            <label>{param.name}:</label>
            <input
              value={
                editedModel.paramValues.find(
                  (paramValue) => paramValue.paramId === param.id
                )?.value || ''
              }
              onChange={(e) =>
                this.handleParamChange(param.id, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    );
  }
}

