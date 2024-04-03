import React, { useRef } from "react";
import { Center, Box, Text, VStack, Input, Button, useToast, Divider  } from "@chakra-ui/react";

export const TemplateReceipt = React.forwardRef(( props, ref) => {
    
    return (
        <div ref={ref}>
            <div style={{ width: "90mm", height: "100mm", alignItems: "center", marginLeft: "auto", marginRight: "auto", marginTop: "10px"}}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p>UMS Digital Library and Service Center</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p style={{ fontSize: "10px", textAlign: "center"}}>Jl. Ir. Sutami No.36A, Kentingan, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Divider height='2px' bg='gray.300' />
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px", marginBottom: "10px" }}>
                    <h4 style={{ margin: "0px", fontWeight: "bold" }}>Bukti Peminjaman</h4>
                </div>
                {/* <div style={{ display: "flex", marginBottom: "5px" }}>
                    <h4 style={{ margin: "0px", fontSize: "12px" }}>No Pinjam. 0001</h4>
                </div> */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "10px" }}>
                    <table style={{ width: "100%",padding: "5px", fontSize: "12px", textAlign: "center"}}>
                        <thead>
                            <tr>
                                <th >Barcode</th>
                                <th >Title</th>
                                <th >Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.barcode}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p>-- Terima Kasih --</p>
                </div>
            </div>
        </div>

    );
});
