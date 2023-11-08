import React, { useEffect, useState } from "react";
import { Text, View, Button, Alert } from "react-native";
import BadgerBakedGood from "./BadgerBakedGood";

export default function BadgerBakery() {

    const [allGoods, setAllGoods] = useState([])
    const [goods, setGoods] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const [cart, setCart] = useState({});
    const [goodIds, setGoodIds] = useState([]);
    let totalCost = 0;
    let isBasketEmpty = true;
    
    useEffect(()=>{
        fetch("https://cs571.org/api/f23/hw7/goods", {
            headers:{
                'X-CS571-ID': 'bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b'
            }
        }).then(res => res.json())
        .then(data => {
            setAllGoods(data)
            const goodIds = Object.keys(data);
            const goodsData = goodIds.map(id => data[id]);
            setGoods(goodsData);
            setGoodIds(goodIds);
            });
        }, []);

        const handleNextClick = () => {
            if (currentPage < Math.ceil(goods.length / itemsPerPage)) {
              setCurrentPage(currentPage + 1);
            }
          }
        
          const handlePreviousClick = () => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }
    
          const isPreviousDisabled = currentPage === 1;
          const isNextDisabled = currentPage === Math.ceil(goods.length / itemsPerPage);
        
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const visibleGoods = goods.slice(startIndex, endIndex);
         
          const currentGoodId = goodIds[currentPage - 1];
          
          const handleAddToCart = (currentGoodId) => {
            setCart(prevCart => ({
              ...prevCart,
              [currentGoodId]: (prevCart[currentGoodId] || 0) + 1
            }));
          };
          
          const handleRemoveFromCart = (currentGoodId) => {
            setCart(prevCart => {
              const updatedCart = { ...prevCart };
              if (updatedCart[currentGoodId] > 0) {
                updatedCart[currentGoodId] -= 1;
              }
              return updatedCart;
            });
          };


          const calculateTotalCost = () => {
            for (const itemId in cart) {
            if (cart.hasOwnProperty(itemId)) {
                const quantity = cart[itemId];
                const item = allGoods[itemId]; 
    
                if (item) {
                    totalCost += item.price * quantity;
                }
                if(totalCost === 0){
                    isBasketEmpty = true;
                }
                else{
                    isBasketEmpty = false;
                }
            }
        }
    
        return "$" + totalCost.toFixed(2);
    }

    const placeOrder = () => {
        if (isBasketEmpty) {
            return; 
        }

        const numItems = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

        Alert.alert(
            "Order Confirmed!",
            `Your order contains ${numItems} items and costs a total of $${totalCost.toFixed(2)}!`,
            [
                { text: "OK", onPress: () => clearBasketAndReturn() }
            ]
        );
    };

    const clearBasketAndReturn = () => {
        setCart({}); 
        setCurrentPage(1); 
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{textAlign: 'center', fontSize:15}}>Welcome to Badger Bakery!</Text>
            <View style={{ flexDirection: "row" }}>
                <Button title="Previous" onPress={handlePreviousClick} disabled={isPreviousDisabled} />
                 <Button title="Next" onPress={handleNextClick} disabled={isNextDisabled} />
            </View>
            {visibleGoods.map((good, index) => (
                 <BadgerBakedGood
                    key={index}
                    id = {currentGoodId}
                    name={good.name}
                    image={good.imgSrc}
                    price={good.price}
                    upperLimit={good.upperLimit}
                    quantityInCart={cart[currentGoodId] || 0}
                    onAddToCart={() => handleAddToCart(currentGoodId)}
                    onRemoveFromCart={() => handleRemoveFromCart(currentGoodId)}
        />
      ))}
            <Text>{calculateTotalCost()}</Text>
            <Button
                title="Place Order"
                onPress={placeOrder}
                disabled={isBasketEmpty}
            />
        </View>
    );
}