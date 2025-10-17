;; title: Pawcoin
;; version: 1.0.0
;; summary: A fun dog-themed cryptocurrency on Stacks
;; description: Pawcoin (PAW) is a SIP-010 fungible token that brings the joy of dogs to the blockchain!

;; traits
;; SIP-010 compatible but not formally implementing external trait

;; token definitions
(define-fungible-token pawcoin)

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))

;; Token metadata
(define-constant token-name "Pawcoin")
(define-constant token-symbol "PAW")
(define-constant token-uri u"https://pawcoin.dog/metadata.json")
(define-constant token-decimals u6)

;; Initial supply: 1 billion PAW tokens (with 6 decimals)
(define-constant initial-supply u1000000000000000)

;; data vars
(define-data-var token-uri-var (string-utf8 256) token-uri)

;; data maps
;; No additional maps needed for basic SIP-010 implementation

;; Initialize contract by minting initial supply to contract owner
(ft-mint? pawcoin initial-supply contract-owner)

;; public functions

;; SIP-010 required functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-not-token-owner)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-transfer? pawcoin amount sender recipient)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-mint? pawcoin amount recipient)
  )
)

(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (ft-burn? pawcoin amount tx-sender)
  )
)

;; Update token URI (owner only)
(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri-var new-uri)
    (ok true)
  )
)

;; read only functions

;; SIP-010 required read-only functions
(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance pawcoin who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply pawcoin))
)

(define-read-only (get-token-uri)
  (ok (some (var-get token-uri-var)))
)

;; Additional utility functions
(define-read-only (get-contract-owner)
  contract-owner
)

;; private functions
;; None needed for basic implementation

