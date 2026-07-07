window.MESH_MANIFEST = {
  "modes": {
    "id": {
      "label": "Held-out test (ID)",
      "run": "augmented-mixdataset-recons-bodypose-capfix30-tuned20-test100-id-k10",
      "scenes": {
        "dance14": {
          "name": "Dance",
          "samples": 6,
          "case": 80,
          "variations": [
            9,
            7,
            0,
            4,
            3,
            2
          ]
        },
        "talk23": {
          "name": "Talking",
          "samples": 6,
          "case": 45,
          "variations": [
            7,
            0,
            6,
            4,
            9,
            2
          ]
        },
        "fight28": {
          "name": "Fight",
          "samples": 6,
          "case": 64,
          "variations": [
            6,
            5,
            7,
            0,
            4,
            1
          ]
        },
        "basketball01": {
          "name": "Basketball",
          "samples": 6,
          "case": 56,
          "variations": [
            6,
            4,
            2,
            9,
            7,
            0
          ]
        },
        "piggyback17": {
          "name": "Piggyback",
          "samples": 6,
          "case": 57,
          "variations": [
            2,
            9,
            0,
            8,
            6,
            3
          ]
        },
        "backhug15": {
          "name": "Back hug",
          "samples": 6,
          "case": 75,
          "variations": [
            1,
            7,
            3,
            6,
            5,
            2
          ]
        }
      }
    },
    "ood": {
      "label": "Mixamo poses (OOD)",
      "run": "augmented-mixdataset-recons-bodypose-capfix30-tuned20-mixamo-ood-k10",
      "scenes": {
        "swingkettleball": {
          "name": "Kettlebell swing",
          "samples": 6,
          "case": 57,
          "variations": [
            4,
            3,
            5,
            0,
            1,
            8
          ]
        },
        "breakdance2": {
          "name": "Breakdance",
          "samples": 6,
          "case": 14,
          "variations": [
            4,
            9,
            8,
            1,
            2,
            3
          ]
        },
        "flair": {
          "name": "Flair",
          "samples": 6,
          "case": 23,
          "variations": [
            0,
            6,
            5,
            4,
            2,
            9
          ]
        },
        "cumbia": {
          "name": "Cumbia",
          "samples": 6,
          "case": 19,
          "variations": [
            6,
            4,
            8,
            3,
            5,
            0
          ]
        },
        "kneelpoint": {
          "name": "Kneel & point",
          "samples": 6,
          "case": 35,
          "variations": [
            8,
            0,
            4,
            6,
            3,
            2
          ]
        },
        "taunt": {
          "name": "Taunt",
          "samples": 6,
          "case": 63,
          "variations": [
            0,
            6,
            8,
            9,
            2,
            7
          ]
        }
      }
    }
  },
  "interp": {
    "fight": {
      "name": "Fight",
      "frames": 40,
      "source": "interpolation-2024-06-13 12_15_37.978662-rid8-fight23-frame35-subj0-sameZsAsPrevious-capfix"
    },
    "cheers": {
      "name": "Cheers",
      "frames": 40,
      "source": "interpolation-2024-06-13 13_26_27.317586-rid5-cheers37-frame46-subj0-sameZs-capfix"
    },
    "kiss": {
      "name": "Kiss",
      "frames": 40,
      "source": "interpolation-2024-06-13 14_15_41.564383-rid8-kiss22-frame43-subj0-sameZs-capfix"
    }
  }
};
