import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { ServiceContext } from '../../Service';

export class MainScreen extends React.Component{

    static contextType = ServiceContext;
    state = {
        isProgress :true,
        user:{nombre:''}
    }
    constructor(props:any){
        super(props);
    }

    componentDidMount() {
        this.context.authService.initUser().finally(()=>{
            this.setState({isProgress:false,user:this.context.authService.getActiveUser()});
        });
    }

    render(){
        return (
            this.state.isProgress ? <this.CustomProgressBar /> :
            <View>
                <Text>Bienvenido {this.state.user.nombre}</Text>
            </View>
        );
    }

    CustomProgressBar = ({ visible }:any) => (
        <Modal onRequestClose={() => null} visible={visible}>
          <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
              <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
              <ActivityIndicator size="large" />
            </View>
          </View>
        </Modal>
      );
}