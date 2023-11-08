import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";

import CS571 from '@cs571/mobile-client'

export default function BadgerBakedGood(props) {
    const { id, name, image, price, upperLimit, quantityInCart, onAddToCart, onRemoveFromCart } = props;
    const [quantityInBasket, setQuantityInBasket] = useState(0);


    
    return (
        <View style={{justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
            <Text style ={{fontSize:48, textAlign: 'center'}}> {name}</Text>
           
            <Text style ={{fontSize:20, textAlign: 'center'}}>Price: ${price.toFixed(2)}</Text>
            <Text style ={{fontSize:20, textAlign: 'center'}}>Available Quantity: {upperLimit === -1 ? "Unlimited" : upperLimit}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 5, margin: 5}}>
                <Button title="-" onPress={onRemoveFromCart} disabled={quantityInCart === 0} />
                <Text>{quantityInCart}</Text>
                <Button title="+" onPress={onAddToCart} disabled={upperLimit !== -1 && quantityInCart === upperLimit} />
            </View>
        </View>
      
    );
}