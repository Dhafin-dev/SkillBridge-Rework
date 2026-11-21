/**
 * SkillBridge Rework — Two-Way Rating & Review System (review.js)
 *
 * Ulasan disimpan ke public.reviews dengan reviewer_id dari session Supabase.
 * target dan workspace harus berasal dari data workspace nyata.
 */

(function () {
  let activeRating = 5;
  let currentTarget = null;
  let currentProjectId = null;
  let currentWorkspaceId = null;
  let completionCallback = null;

  function ensureModal() {
    let modal = document.getElementById('review-modal-backdrop');
    if (modal) return modal;

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

            <div class="form-group" style="text-align: left;">
              <label class="form-label" for="review-comment">Ulasan Kualitatif / Testimoni</label>
              <textarea id="review-comment" class="form-textarea" placeholder="Tuliskan testimoni mengenai ketepatan waktu, kualitas teknis, dan komunikasi..." required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="review-btn-cancel">Batal</button>
            <button type="submit" class="btn btn-primary" id="review-btn-submit">Kirim Ulasan</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('.star-btn').forEach(button => {
      button.addEventListener('click', () => {
        activeRating = parseInt(button.getAttribute('data-star'), 10);
        updateStarDisplay(activeRating);
      });
    });

    modal.querySelector('#review-modal-close').addEventListener('click', closeModal);
    modal.querySelector('#review-btn-cancel').addEventListener('click', closeModal);

    modal.querySelector('#review-form').addEventListener('submit', async event => {
      event.preventDefault();
      const submitButton = modal.querySelector('#review-btn-submit');
      const comment = modal.querySelector('#review-comment').value.trim();

      if (!currentTarget?.id) {
        window.toast?.error('Penerima ulasan tidak valid.');
        return;
      }
      if (!comment) {
        window.toast?.warning('Ulasan wajib diisi.');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Mengirim...';
      try {
        await window.SkillBridgeDB.submitReview({
          project_id: currentProjectId,
          workspace_id: currentWorkspaceId,
          target_id: currentTarget.id,
          rating: activeRating,
          comment
        });
        closeModal();
        window.toast?.success('Ulasan dan rating bintang berhasil dikirim!');
        if (typeof completionCallback === 'function') completionCallback();
      } catch (error) {
        window.toast?.error(error.message || 'Gagal mengirim ulasan.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim Ulasan';
      }
    });

    return modal;
  }

  function updateStarDisplay(rating) {
    const modal = document.getElementById('review-modal-backdrop');
    if (!modal) return;
    modal.querySelectorAll('.star-btn').forEach(star => {
      const value = parseInt(star.getAttribute('data-star'), 10);
      star.classList.toggle('active', value <= rating);
    });

    const labels = [
      '',
      '1 Bintang — Kurang Memuaskan',
      '2 Bintang — Cukup',
      '3 Bintang — Baik',
      '4 Bintang — Sangat Baik',
      '5 Bintang — Luar Biasa & Sangat Direkomendasikan'
    ];
    const label = modal.querySelector('#rating-label');
    if (label) label.textContent = labels[rating] || '';
  }

  function closeModal() {
    document.getElementById('review-modal-backdrop')?.classList.remove('active');
  }

  window.SkillBridgeReview = {
    openModal(target, projectId = null, callback = null, workspaceId = null) {
      if (!target || !projectId) {
        window.toast?.error('Data proyek/penerima ulasan belum lengkap.');
        return;
      }
      if (typeof target === 'string') target = { id: null, name: target };
      if (!target.id) {
        window.toast?.error('ID penerima ulasan tidak ditemukan.');
        return;
      }

      const modal = ensureModal();
      currentTarget = target;
      currentProjectId = projectId;
      currentWorkspaceId = workspaceId;
      completionCallback = callback;
      activeRating = 5;
      updateStarDisplay(5);

      modal.querySelector('#review-modal-title').textContent = `Beri Penilaian untuk ${target.name || 'Penerima'}`;
      modal.querySelector('#review-comment').value = '';
      modal.classList.add('active');
    },

    closeModal
  };
})();
