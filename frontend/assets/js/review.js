/**
 * SkillBridge Rework — Two-Way Rating & Review System (review.js)
 * Provides mutual feedback and testimonial modal between Mahasiswa and UMKM.
 */

(function () {
  let activeRating = 5;
  let currentTarget = null;
  let currentProjectId = null;
  let completionCallback = null;

  function ensureModal() {
    let modal = document.getElementById('review-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'review-modal-backdrop';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-container" style="max-width: 500px;">
          <div class="modal-header">
            <h3 class="modal-title" id="review-modal-title">Beri Penilaian & Ulasan</h3>
            <button class="modal-close" id="review-modal-close">&times;</button>
          </div>
          <form id="review-form">
            <div class="modal-body" style="text-align: center;">
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);" id="review-subtitle">
                Bagikan pengalaman kerja sama Anda untuk membangun reputasi terverifikasi.
              </p>

              <!-- Star Rating -->
              <div class="rating-stars" id="star-rating-container" style="margin-bottom: var(--space-4);">
                <button type="button" class="star-btn active" data-star="1">★</button>
                <button type="button" class="star-btn active" data-star="2">★</button>
                <button type="button" class="star-btn active" data-star="3">★</button>
                <button type="button" class="star-btn active" data-star="4">★</button>
                <button type="button" class="star-btn active" data-star="5">★</button>
              </div>
              <div id="rating-label" style="font-size: var(--font-size-sm); font-weight: 700; color: #D97706; margin-bottom: var(--space-4);">
                5 Bintang — Luar Biasa & Sangat Direkomendasikan
              </div>

              <!-- Feedback Text -->
              <div class="form-group" style="text-align: left;">
                <label class="form-label" for="review-comment">Ulasan Kualitatif / Testimoni</label>
                <textarea id="review-comment" class="form-textarea" placeholder="Tuliskan testimoni mengenai ketepatan waktu, kualitas teknis, dan komunikasi..." required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" id="review-btn-cancel">Batal</button>
              <button type="submit" class="btn btn-primary">Kirim Ulasan</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      // Star click events
      const stars = modal.querySelectorAll('.star-btn');
      stars.forEach(btn => {
        btn.addEventListener('click', () => {
          activeRating = parseInt(btn.getAttribute('data-star'), 10);
          updateStarDisplay(activeRating);
        });
      });

      // Close handlers
      modal.querySelector('#review-modal-close').addEventListener('click', closeModal);
      modal.querySelector('#review-btn-cancel').addEventListener('click', closeModal);

      // Form submit
      modal.querySelector('#review-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const comment = modal.querySelector('#review-comment').value;
        const currentUser = window.SkillBridgeAuth.getUser();

        await window.SkillBridgeDB.submitReview({
          project_id: currentProjectId,
          reviewer_id: currentUser?.id || 'anon',
          reviewer_name: currentUser?.name || 'Mitra',
          reviewer_role: currentUser?.role || 'mahasiswa',
          target_id: currentTarget?.id || 'target_1',
          target_name: currentTarget?.name || 'Penerima',
          rating: activeRating,
          comment: comment
        });

        closeModal();
        window.toast.success('Ulasan dan rating bintang berhasil dikirim!');

        if (completionCallback) completionCallback();
      });
    }
    return modal;
  }

  function updateStarDisplay(rating) {
    const modal = document.getElementById('review-modal-backdrop');
    const stars = modal.querySelectorAll('.star-btn');
    const labels = [
      '',
      '1 Bintang — Kurang Memuaskan',
      '2 Bintang — Cukup',
      '3 Bintang — Baik',
      '4 Bintang — Sangat Baik',
      '5 Bintang — Luar Biasa & Sangat Direkomendasikan'
    ];

    stars.forEach(s => {
      const val = parseInt(s.getAttribute('data-star'), 10);
      if (val <= rating) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    const lbl = modal.querySelector('#rating-label');
    if (lbl) lbl.textContent = labels[rating] || '';
  }

  function closeModal() {
    const modal = document.getElementById('review-modal-backdrop');
    if (modal) modal.classList.remove('active');
  }

  window.SkillBridgeReview = {
    openModal(target, projectId = 'p1', callback = null) {
      const modal = ensureModal();
      currentTarget = target;
      currentProjectId = projectId;
      completionCallback = callback;
      activeRating = 5;
      updateStarDisplay(5);

      modal.querySelector('#review-modal-title').textContent = `Beri Penilaian untuk ${target.name}`;
      modal.querySelector('#review-comment').value = '';
      modal.classList.add('active');
    }
  };
})();
