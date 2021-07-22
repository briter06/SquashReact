import React from 'react'
import PDFReader from 'rn-pdf-reader-js'

interface Props{
    navigation:any,
    source:string
}

export default class PDFViewer extends React.Component<Props> {
    render() {
        return (
            <PDFReader
                source={{
                    uri: this.props.source,
                }}
            />
        )
    }
}