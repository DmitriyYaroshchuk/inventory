'use client';

import { makeStore } from "@/store";
import { useState, type ReactNode } from 'react'
import { Provider } from "react-redux";

function Providers({ children }: { children: ReactNode }) {
    const [store] = useState(makeStore);
    return <Provider store={store}>{children}</Provider>
}
export default Providers;