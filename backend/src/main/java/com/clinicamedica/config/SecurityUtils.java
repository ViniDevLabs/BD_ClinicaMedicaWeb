package com.clinicamedica.config;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Arrays;

public class SecurityUtils {

    private SecurityUtils() {
    }

    public static void verificarPermissaoOuProprioId(Integer idAlvo, String... perfisIrrestritos) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomPrincipal principal)) {
            throw new AccessDeniedException("Acesso negado: Usuário não autenticado.");
        }

        boolean temAcessoIrrestrito = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .anyMatch(role -> Arrays.asList(perfisIrrestritos).contains(role));

        if (!temAcessoIrrestrito && !principal.id().equals(idAlvo)) {
            throw new AccessDeniedException(
                    "Acesso negado: Você não possui permissão para acessar ou alterar este recurso.");
        }
    }
}