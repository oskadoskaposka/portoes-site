const KEY = "starpro_customer_type_v1";

export type CustomerType = "avulso" | "regular";

export function getCustomerType(): CustomerType {
  if (typeof window === "undefined") return "avulso";
  return window.localStorage.getItem(KEY) === "regular" ? "regular" : "avulso";
}

export function setCustomerType(v: CustomerType) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, v);
  window.dispatchEvent(new Event("customer:changed"));
}
