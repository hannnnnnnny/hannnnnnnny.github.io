import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from sklearn.datasets import make_blobs
from sklearn.neighbors import KNeighborsClassifier


np.random.seed(7)

X, y = make_blobs(
    n_samples=180,
    centers=[(-2.2, -1.0), (1.9, 1.35), (0.2, -2.15)],
    cluster_std=[0.82, 0.9, 0.72],
    random_state=7,
)

knn = KNeighborsClassifier(n_neighbors=7, weights="distance")
knn.fit(X, y)

x_min, x_max = X[:, 0].min() - 1.1, X[:, 0].max() + 1.1
y_min, y_max = X[:, 1].min() - 1.1, X[:, 1].max() + 1.1
xx, yy = np.meshgrid(
    np.linspace(x_min, x_max, 520),
    np.linspace(y_min, y_max, 420),
)
Z = knn.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

fig, ax = plt.subplots(figsize=(10, 7), dpi=180)
fig.patch.set_facecolor("#fff7fb")
ax.set_facecolor("#fff7fb")

region_cmap = ListedColormap(["#ffd4e3", "#d8f4eb", "#ddd6ff"])
point_colors = ["#c94f7c", "#2f9d82", "#6b5bd6"]

ax.contourf(xx, yy, Z, levels=[-0.5, 0.5, 1.5, 2.5], cmap=region_cmap, alpha=0.72)
ax.contour(xx, yy, Z, levels=[0.5, 1.5], colors=["#ffffff"], linewidths=2.2, alpha=0.85)

for cls, color, label in zip(range(3), point_colors, ["Segment A", "Segment B", "Segment C"]):
    points = X[y == cls]
    ax.scatter(
        points[:, 0],
        points[:, 1],
        s=58,
        c=color,
        label=label,
        edgecolor="white",
        linewidth=1.4,
        alpha=0.92,
    )

ax.set_title("KNN Decision Boundary: Customer-Like Segments", fontsize=18, weight="bold", color="#241a22", pad=18)
ax.set_xlabel("Feature 1: engagement score", color="#6f5a66")
ax.set_ylabel("Feature 2: value signal", color="#6f5a66")
ax.grid(color="#ffffff", linewidth=1.1, alpha=0.7)
ax.tick_params(colors="#6f5a66")

legend = ax.legend(frameon=True, loc="upper left")
legend.get_frame().set_facecolor("#ffffff")
legend.get_frame().set_edgecolor("#f5b6cc")

for spine in ax.spines.values():
    spine.set_color("#f1b3ca")

plt.tight_layout()
plt.savefig("assets/knn-distribution.png", bbox_inches="tight")
