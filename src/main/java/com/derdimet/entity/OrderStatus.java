package com.derdimet.entity;

public enum OrderStatus {
  /** @deprecated Eski kayıtlar; yeni akışta PAYMENT_PENDING kullanılır. */
  PENDING,
  PAYMENT_PENDING,
  PAYMENT_CONFIRMED,
  COMPLETED,
  CANCELLED
}
