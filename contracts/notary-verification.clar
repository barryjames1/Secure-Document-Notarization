;; Notary Verification Contract
;; Validates credentials of authorized notaries

(define-constant contract-owner tx-sender)

(define-map notaries
  { notary-id: principal }
  {
    is-active: bool,
    name: (string-utf8 100),
    registration-time: uint
  }
)

(define-read-only (is-notary (notary principal))
  (default-to false (get is-active (map-get? notaries { notary-id: notary })))
)

(define-read-only (get-notary-info (notary principal))
  (map-get? notaries { notary-id: notary })
)

(define-public (register-notary (notary principal) (name (string-utf8 100)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (asserts! (is-none (get-notary-info notary)) (err u409))

    (map-set notaries
      { notary-id: notary }
      {
        is-active: true,
        name: name,
        registration-time: (unwrap-panic (get-block-info? time (- block-height u1)))
      }
    )
    (ok true)
  )
)

(define-public (deactivate-notary (notary principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (asserts! (is-some (get-notary-info notary)) (err u404))

    (let ((notary-data (unwrap-panic (get-notary-info notary))))
      (map-set notaries
        { notary-id: notary }
        (merge notary-data { is-active: false })
      )
    )
    (ok true)
  )
)
