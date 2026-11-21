package expo.modules.casitadexplus;

import java.nio.charset.StandardCharsets;
import java.security.KeyPairGenerator;
import java.security.Signature;

public class PlaySignatureTest {
    public static void main(String[] args) throws Exception {
        var generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        var pair = generator.generateKeyPair();
        var json = "{\"productId\":\"com.designsbyfa.casitadex.plus\"}";
        var signer = Signature.getInstance("SHA1withRSA");
        signer.initSign(pair.getPrivate());
        signer.update(json.getBytes(StandardCharsets.UTF_8));
        var signature = signer.sign();
        if (!PlaySignature.matches(pair.getPublic(), json, signature)
                || PlaySignature.matches(pair.getPublic(), json + " ", signature)
                || PlaySignature.matches(generator.generateKeyPair().getPublic(), json, signature)
                || PlaySignature.matches(pair.getPublic(), json, new byte[0])) {
            throw new AssertionError("Unexpected Play signature verification result");
        }
        System.out.println("PASS: valid signature, altered payload, wrong key, empty signature");
    }
}
