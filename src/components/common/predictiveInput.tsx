import "reflect-metadata";
import React from 'react';
import AutocompleteInput from "react-native-autocomplete-input";
import { globalStyles } from "../styles";
import { Text, TouchableOpacity } from "react-native";

interface Props {
    data: {value:any,display:string}[]
    value: string
    onChange: (data:string)=>void
    onPress: (data:string)=>void
    placeHolder: string
    startValue?: boolean
}

interface State{
    predictiveSeleccionado: boolean
}

export class PredictiveInput extends React.Component<Props,State>{

    constructor(props:any){
        super(props)
        this.state = {
            predictiveSeleccionado: this.props.startValue ? true : false
        }
    }


    render() {
        return (
            <AutocompleteInput
                inputContainerStyle={[globalStyles.textInput]}
                listContainerStyle={[{width:'100%'}]}
                placeholder={this.props.placeHolder}
                style={[{borderWidth:0,justifyContent:'center',alignItems:'center'}]}
                autoCorrect={false}
                data={this.state.predictiveSeleccionado || this.props.value.trim()==='' ? [] : this.props.data}
                value={this.props.value}
                onChangeText={(text:string)=>{
                    this.setState({predictiveSeleccionado: false})
                    this.props.onChange(text)
                }}
                flatListProps={{
                    keyboardShouldPersistTaps: 'always',
                    keyExtractor: (_:any, idx:any) => idx,
                    renderItem: (elem:any) => (
                        <TouchableOpacity onPress={()=>{
                            this.setState({predictiveSeleccionado: true})
                            this.props.onPress(elem.item.value)
                        }}>
                            <Text>{elem.item.display}</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        )
    }
}