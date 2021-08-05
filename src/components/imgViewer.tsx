// import ImageView from "react-native-image-viewing";
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { BackHandler, Modal, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { Text } from 'react-native-elements';
 

interface Props{
    visible:boolean,
    close:any,
    image:string
}

export default class ImgViewer extends React.Component<Props>{

    constructor(props:any){
        super(props);
    }

    render(){
        return (
            // <ImageView
            //     images={[{uri:this.props.image}]}
            //     imageIndex={0}
            //     visible={this.props.visible}
            //     onRequestClose={this.props.close}
            // />
            <Modal visible={this.props.visible}  transparent={true}>
                <ImageViewer onCancel={this.props.close} imageUrls={[
                    {
                        url: this.props.image
                    }
                ]}
                enableSwipeDown={true}
                saveToLocalByLongPress={true}
                renderHeader={
                    ()=>
                    <View style={{width:'100%',flexDirection:'row-reverse'}}>
                        <TouchableOpacity onPress={this.props.close}>
                            <AntDesign
                            style={{marginRight:15,marginTop:15}}
                            name="closecircleo" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                }
                />
            </Modal>
        );
    }
}
 
