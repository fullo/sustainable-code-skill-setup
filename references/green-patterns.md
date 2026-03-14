# Green Software Patterns Reference

Curated catalog from the Green Software Foundation. Each pattern describes a
concrete technique to reduce the environmental impact of software.

Catalog: <https://patterns.greensoftware.foundation/>

## AI Patterns (9)

| Pattern | Description | SCI Impact |
|---------|-------------|------------|
| compress-ml-models-for-inference | Apply quantization and pruning to reduce model size and inference energy | Reduces E |
| efficient-format-for-model-training | Use optimized data formats (TFRecord, Parquet) to cut I/O during training | Reduces E |
| energy-efficient-ai-edge | Run inference on edge/device when possible to avoid network and data center energy | Reduces E, I |
| energy-efficient-framework | Choose frameworks with lower energy overhead (e.g., ONNX Runtime vs raw PyTorch) | Reduces E |
| energy-efficient-models | Prefer smaller, more efficient model architectures (distillation, MobileNet) | Reduces E |
| leverage-sustainable-regions | Train and run models in low-carbon grid regions | Reduces I |
| pre-trained-transfer-learning | Fine-tune existing models instead of training from scratch | Reduces E |
| right-hardware-type | Match workload to hardware (GPU vs CPU vs TPU) for energy efficiency | Reduces E |
| serverless-model-development | Use serverless for intermittent inference to avoid idle server energy | Reduces E, M |

## Cloud Patterns (~30)

| Pattern | Description | SCI Impact |
|---------|-------------|------------|
| cache-static-data | Cache responses to avoid redundant computation and network transfer | Reduces E |
| choose-region-closest-to-users | Reduce network hops and latency by deploying near users | Reduces E |
| compress-stored-data | Compress data at rest to reduce storage energy and embodied carbon | Reduces E, M |
| compress-transmitted-data | Use gzip/brotli for network payloads | Reduces E |
| containerize-workload | Containers share OS resources more efficiently than VMs | Reduces E, M |
| delete-unused-storage | Remove orphaned volumes, snapshots, and objects | Reduces M |
| evaluate-other-cpu-architectures | ARM-based instances (Graviton, Ampere) often deliver better perf/watt | Reduces E |
| implement-stateless-design | Stateless services scale down to zero more easily | Reduces E, M |
| match-slo | Don't over-provision; right-size to actual SLO requirements | Reduces E, M |
| minimize-deployed-environments | Consolidate staging/dev environments; shut down when unused | Reduces E, M |
| optimize-cpu-utilization | Target higher CPU utilization (60-80%) to reduce idle waste | Reduces E |
| queue-non-urgent-requests | Defer batch work to low-carbon periods | Reduces I |
| scale-infrastructure-with-user-load | Auto-scale to match demand, avoid constant over-provisioning | Reduces E, M |
| time-shift-kubernetes-cron-jobs | Schedule cron jobs during low-carbon grid periods | Reduces I |
| use-async | Asynchronous processing avoids blocking threads and idle CPU | Reduces E |
| use-circuit-breaker | Prevent cascading failures that waste energy on retries | Reduces E |
| use-compiled-languages | Compiled languages (Go, Rust, C) use less CPU per operation than interpreted | Reduces E |
| use-serverless | Serverless scales to zero; no idle infrastructure cost | Reduces E, M |

## Web Patterns (14)

| Pattern | Description | SCI Impact |
|---------|-------------|------------|
| avoid-chaining-critical-requests | Reduce sequential blocking requests that delay rendering | Reduces E |
| avoid-excessive-dom-size | Smaller DOM means less memory, layout, and paint work | Reduces E |
| avoid-tracking-unnecessary-data | Remove unused analytics and trackers | Reduces E |
| defer-offscreen-images | Lazy-load images below the fold | Reduces E |
| deprecate-gifs | Replace animated GIFs with video (MP4/WebM) for 10-50x size reduction | Reduces E |
| enable-text-compression | Serve text assets with brotli/gzip | Reduces E |
| keep-request-counts-low | Fewer HTTP requests means less network and server energy | Reduces E |
| minify-web-assets | Minify JS, CSS, HTML to reduce transfer size | Reduces E |
| minimize-main-thread-work | Reduce CPU work on the client device | Reduces E |
| properly-sized-images | Serve images at display size, not larger | Reduces E |
| remove-unused-css | Eliminate dead CSS to reduce parse and transfer cost | Reduces E |
| serve-images-in-modern-formats | Use WebP/AVIF instead of PNG/JPEG for 25-50% size savings | Reduces E |
| use-server-side-rendering | SSR reduces client CPU for content-heavy pages | Reduces E |

## Mapping Patterns to Skill Phases

| Skill Phase | Relevant Pattern Categories |
|------------|---------------------------|
| Phase 2 (Energy & Carbon) | All AI patterns, cloud: optimize-cpu-utilization, use-compiled-languages, queue-non-urgent-requests |
| Phase 3 (WSG Compliance) | Web: all 14 patterns map directly to WSG web development guidelines |
| Phase 4 (Accessibility) | Web: avoid-excessive-dom-size, minimize-main-thread-work (better a11y perf) |
| Phase 5 (Performance) | Web: all 14 patterns, cloud: cache-static-data, compress-transmitted-data, scale-infrastructure-with-user-load |
| Phase 6 (Testing & Quality) | Cloud: minimize-deployed-environments, match-slo (right-size CI resources) |

## References

- [Green Software Foundation Patterns Catalog](https://patterns.greensoftware.foundation/)
- [Green Software Foundation SCI Specification](https://sci-guide.greensoftware.foundation/)
- [Green Software Principles](https://learn.greensoftware.foundation/)
