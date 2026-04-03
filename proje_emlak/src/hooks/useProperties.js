import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseProps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(firebaseProps);
      setLoading(false);
    }, () => {
      setProperties([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const daireProperties = properties.filter((p) => p.type === "Daire");
  const ofisProperties = properties.filter((p) => p.type === "Ofis");
  const arsaProperties = properties.filter((p) => p.type === "Arsa");
  const saleProperties = properties.filter((p) => p.status === "SATILIK");
  const rentProperties = properties.filter((p) => p.status === "KİRALIK");

  return {
    properties,
    daireProperties,
    ofisProperties,
    arsaProperties,
    saleProperties,
    rentProperties,
    loading
  };
}
