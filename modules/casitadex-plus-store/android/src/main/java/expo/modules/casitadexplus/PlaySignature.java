package expo.modules.casitadexplus;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.PublicKey;
import java.security.Signature;

final class PlaySignature {
    static boolean matches(PublicKey key, String json, byte[] signature) {
        try {
            Signature verifier = Signature.getInstance("SHA1withRSA");
            verifier.initVerify(key);
            verifier.update(json.getBytes(StandardCharsets.UTF_8));
            return verifier.verify(signature);
        } catch (GeneralSecurityException error) {
            return false;
        }
    }
}
