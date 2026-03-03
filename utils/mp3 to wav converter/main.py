from pathlib import Path

from pydub import AudioSegment


def mp3_to_wav(input_path: Path, output_path: Path | None = None) -> Path:
    """
    Convertit un fichier .mp3 en .wav.

    input_path : chemin du fichier .mp3
    output_path : chemin de sortie .wav (si None, même dossier / même nom)
    """
    input_path = input_path.resolve()
    if output_path is None:
        output_path = input_path.with_suffix(".wav")

    audio = AudioSegment.from_mp3(input_path)
    audio.export(output_path, format="wav")
    return output_path


def main() -> None:
    # Dossier courant = dossier du script
    base_dir = Path(__file__).parent

    mp3_files = list(base_dir.glob("*.mp3"))

    if not mp3_files:
        print("Aucun fichier .mp3 trouvé dans ce dossier.")
        return

    print(f"{len(mp3_files)} fichier(s) .mp3 trouvé(s). Lancement de la conversion...")

    for mp3_file in mp3_files:
        output_file = mp3_to_wav(mp3_file)
        print(f"Converti : {mp3_file.name} -> {output_file.name}")


if __name__ == "__main__":
    main()

