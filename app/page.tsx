"use client";

import { useState, useEffect } from "react";

function DataFetchingComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
}
// TODO: ПЕРЕПИСАТЬ ЗАПРОС ИЗ АПИ ТС
export default function Home() {
  return <DataFetchingComponent />;
}
