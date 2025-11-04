;; Pawbit fungible token (SIP-010-style)

(define-fungible-token pawbit)

(define-data-var owner principal tx-sender)

(define-constant ERR-NOT-OWNER u401)
(define-constant ERR-NOT-SENDER u403)

(define-private (ensure-owner)
  (if (is-eq tx-sender (var-get owner))
      (ok true)
      (err ERR-NOT-OWNER)))

(define-read-only (get-name) (ok "Pawbit"))
(define-read-only (get-symbol) (ok "PAWBIT"))
(define-read-only (get-decimals) (ok u6))
(define-read-only (get-token-uri) (ok none))

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance pawbit who)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply pawbit)))

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err ERR-NOT-SENDER))
    (ft-transfer? pawbit amount sender recipient)))

(define-public (mint (amount uint) (recipient principal))
  (begin
    (try! (ensure-owner))
    (ft-mint? pawbit amount recipient)))

(define-public (burn (amount uint) (holder principal))
  (begin
    (asserts! (is-eq tx-sender holder) (err ERR-NOT-SENDER))
    (ft-burn? pawbit amount holder)))

(define-public (set-owner (new-owner principal))
  (begin
    (try! (ensure-owner))
    (var-set owner new-owner)
    (ok true)))
