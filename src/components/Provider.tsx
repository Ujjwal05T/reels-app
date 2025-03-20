'use client'
import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import React from 'react';
const urlEndpoint = process.env.URL_ENDPOINT;
const publicKey = process.env.PUBLIC_KEY;


export default function Providers({children}:{children:React.ReactNode}) {
   const authenticator = async () => {
      try {
        const response = await fetch("/api/imagekit-auth");
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
    
        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
      } catch (error) {
       console.log(error);
        throw new Error(`Authentication request failed`);
      }
    };
  return (
   //session provider handles session of the user
   //it will allow image upload if the user is authenticated
   <SessionProvider >
      <ImageKitProvider urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
         {children}
        {/* ...client side upload component goes here */}
      </ImageKitProvider>
   </SessionProvider>
  );
}