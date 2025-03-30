;; Document Hashing Contract
;; Creates unique digital fingerprints of documents

(define-data-var last-document-id uint u0)

(define-map documents
  { document-id: uint }
  {
    hash: (buff 32),
    owner: principal,
    timestamp: uint,
    status: (string-ascii 20)
  }
)

(define-read-only (get-document (document-id uint))
  (map-get? documents { document-id: document-id })
)

(define-read-only (get-last-document-id)
  (var-get last-document-id)
)

(define-public (register-document (document-hash (buff 32)))
  (let
    (
      (new-id (+ (var-get last-document-id) u1))
      (current-time (unwrap-panic (get-block-info? time (- block-height u1))))
    )
    (var-set last-document-id new-id)
    (map-set documents
      { document-id: new-id }
      {
        hash: document-hash,
        owner: tx-sender,
        timestamp: current-time,
        status: "registered"
      }
    )
    (ok new-id)
  )
)

(define-public (verify-document (document-id uint) (document-hash (buff 32)))
  (let ((doc (unwrap! (get-document document-id) (err u404))))
    (if (is-eq (get hash doc) document-hash)
      (ok true)
      (ok false)
    )
  )
)
